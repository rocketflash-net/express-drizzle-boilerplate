export default interface UpdateInterface<TPayload, TId = number> {
  // Mengembalikan jumlah baris yang terpengaruh
  update(id: TId, payload: TPayload): Promise<number>;
}
