import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';
import InternalResponse from '@libs/InternalResponse';
import LambdaResponse from '@libs/LambdaResponse';
import { BadRequestException } from '@utils/Exceptions';
import { Blog } from 'src/data-access-layer/BlogDAL';
const { getPostList } = Blog;

const log = new LambdaLog();

log.options.debug = Boolean(true);

/**
 * Handlers
 */

export const handlerGetPosts = async (
  _event: APIGatewayEvent,
  _context: Context,
  _callback: Callback
): Promise<void> => {
  const output = await getPosts(_event);
  _callback(null, new LambdaResponse(output));
};

/**
 * Functions
 */

const getPosts = async (
  event: APIGatewayEvent
): Promise<InternalResponse> => {
  const output = new InternalResponse();

  try {
    if (event.queryStringParameters) {
      const { start, size } = event.queryStringParameters;
      if (parseInt(size) > 15) {
        output.isError = true;
        output.statusCode = 500;
        output.clientMessage = "Please provide a size lower than 15"
      } else {

        const posts = await getPostList(parseInt(start), parseInt(size));
        output.payload = posts;

        if (posts.length == 0) {
          output.isError = true;
          output.statusCode = 404;
          output.clientMessage = "Not Found!"
        }
      }
    } else {
      output.isError = true;
      output.statusCode = 500;
      output.clientMessage = "Please provide query strings (start and size)!"
    }
    return output;
  } catch (error) {
    const msg = (error as Error).message;
    throw new BadRequestException(msg, error);
  }
};
