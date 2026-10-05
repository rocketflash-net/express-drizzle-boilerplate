import Service from "@base/service.base";
import UserDto from "@dto/user/user.dto";
import ConflictException from "@exceptions/conflict.exception";
import NotFoundException from "@exceptions/not-found.exception";
import UserRepository from "@repositories/user.repository";
import { buildPaginationMeta, toPaginationOptions } from "@utils/pagination.util";
import { PaginationQueryType } from "@@types/pagination.type";
import ResponseType from "@@types/response.type";
import { CreateUserType, UpdateUserType, UserFilterType, UserType } from "@@types/user.type";

export default class UserService extends Service {
  // Repository di-inject lewat constructor supaya service tidak terikat ke satu implementasi.
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {
    super();
  }

  async findAll(filter: UserFilterType, pagination: PaginationQueryType): Promise<ResponseType> {
    const [users, total] = await Promise.all([this.userRepository.findAll(filter, toPaginationOptions(pagination)), this.userRepository.count(filter)]);
    return this.success(UserDto.collection(users), "Success", undefined, { pagination: buildPaginationMeta(pagination, total) });
  }

  async findById(id: number): Promise<ResponseType> {
    const user = await this.findOrFail(id);
    return this.success(UserDto.fromEntity(user));
  }

  async store(payload: CreateUserType): Promise<ResponseType> {
    await this.ensureEmailIsUnique(payload.email);
    const user = await this.userRepository.store(payload);
    return this.created(UserDto.fromEntity(user), "User created");
  }

  async update(id: number, payload: UpdateUserType): Promise<ResponseType> {
    await this.findOrFail(id);
    if (payload.email) await this.ensureEmailIsUnique(payload.email, id);
    await this.userRepository.update(id, payload);
    const user = await this.findOrFail(id);
    return this.success(UserDto.fromEntity(user), "User updated");
  }

  async destroy(id: number): Promise<ResponseType> {
    await this.findOrFail(id);
    await this.userRepository.destroy(id);
    return this.success(null, "User deleted");
  }

  private async findOrFail(id: number): Promise<UserType> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  private async ensureEmailIsUnique(email: string, ignoreId?: number): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing && existing.id !== ignoreId) throw new ConflictException(`Email ${email} is already registered`);
  }
}
