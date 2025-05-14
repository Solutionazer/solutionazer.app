/**
 * This file is part of solutionazer.app.
 *
 * solutionazer.app is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License only.
 *
 * solutionazer.app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with solutionazer.app. If not, see <https://www.gnu.org/licenses/gpl-3.0.en.html>.
 *
 * Copyright (C) 2025 David Llamas Román
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from 'src/users-management/dtos/permissions.dtos';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  //! NOT IMPLEMENTED
  findAllByRoleUuid(uuid: string) {}

  async findOne(uuid: string) {
    const permission: Permission | null =
      await this.permissionRepository.findOne({
        where: { uuid },
      });

    if (!permission) {
      throw new NotFoundException(`Permission = { uuid: ${uuid} } not found`);
    }

    return permission;
  }

  create(data: CreatePermissionDto) {
    const newPermission: Permission = this.permissionRepository.create(data);
    return this.permissionRepository.save(newPermission);
  }

  async update(uuid: string, changes: UpdatePermissionDto) {
    const permission: Permission = await this.findOne(uuid);

    this.permissionRepository.merge(permission, changes);
    return this.permissionRepository.save(permission);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.permissionRepository.delete(uuid);
  }
}
