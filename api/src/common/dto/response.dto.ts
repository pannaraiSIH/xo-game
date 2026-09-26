export class ResponseDto<T = void> {
  success: boolean;
  data?: T;
}
