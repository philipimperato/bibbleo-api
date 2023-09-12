export default interface FindAllResponse<T> {
  $skip: number;
  $limit: number;
  total: number;
  data: T[];
}
