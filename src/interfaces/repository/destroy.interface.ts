export default interface DestroyInterface<TId = number> {
  // Mengembalikan jumlah baris yang terhapus
  destroy(id: TId): Promise<number>;
}
