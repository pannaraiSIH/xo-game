export interface ResponseDto<T = void> {
  success: boolean;
  data?: T;
}
