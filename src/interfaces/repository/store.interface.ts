export default interface StoreInterface<TPayload, TEntity> {
  store(payload: TPayload): Promise<TEntity>;
}
