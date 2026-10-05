import { UserType } from "@@types/user.type";

/**
 * Bentuk data user yang dikirim ke client.
 * Dipisah dari entity database supaya kolom internal tidak ikut bocor ke response.
 */
export default class UserDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserType) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromEntity(user: UserType): UserDto {
    return new UserDto(user);
  }

  static collection(users: UserType[]): UserDto[] {
    return users.map((user) => new UserDto(user));
  }
}
