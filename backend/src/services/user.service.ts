import prisma from '../client.ts';
import { Prisma, Role, User } from '../generated/prisma/index.js';
import ApiError from '../utils/ApiError.ts';
import { encryptPassword } from '../utils/encryption.ts';
import httpStatus from 'http-status';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (email: string, password: string, name?: string, role: Role = Role.USER): Promise<User> => {
    if (await getUserByEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return prisma.user.create({
        data: {
            email,
            name,
            password: await encryptPassword(password),
            role
        }
    });
};

/**
 * Query for users with pagination
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
    },
    keys: Key[] = ['id', 'email', 'name', 'role', 'isEmailVerified', 'createdAt', 'updatedAt'] as Key[]
): Promise<{
    results: Pick<User, Key>[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    // Parse sortBy option (format: "field:asc" or "field:desc")
    let orderBy = undefined;
    if (options.sortBy) {
        const [field, direction] = options.sortBy.split(':');
        if (field && (direction === 'asc' || direction === 'desc')) {
            orderBy = { [field]: direction };
        }
    }

    const [users, totalResults] = await Promise.all([
        prisma.user.findMany({
            where: filter,
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
            skip,
            take: limit,
            orderBy
        }),
        prisma.user.count({ where: filter })
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return {
        results: users as Pick<User, Key>[],
        page,
        limit,
        totalPages,
        totalResults
    };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
    id: number,
    keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'isEmailVerified', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<User, Key> | null> => {
    return (await prisma.user.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    })) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
    email: string,
    keys: Key[] = ['id', 'email', 'name', 'password', 'role', 'isEmailVerified', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<User, Key> | null> => {
    return await (prisma.user.findUnique({
        where: { email },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<User, Key> | null>);
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
    userId: number,
    updateBody: Prisma.UserUpdateInput,
    keys: Key[] = ['id', 'email', 'name', 'role', 'isEmailVerified', 'createdAt', 'updatedAt'] as Key[]
): Promise<Pick<User, Key> | null> => {
    const user = await getUserById(userId, ['id', 'email', 'name']);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if email is being updated and if it's already taken by another user
    if (updateBody.email && updateBody.email !== user.email) {
        const existingUser = await getUserByEmail(updateBody.email as string);
        if (existingUser && existingUser.id !== userId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
    }

    // Encrypt password if it's being updated
    const dataToUpdate = { ...updateBody };
    if (dataToUpdate.password) {
        dataToUpdate.password = await encryptPassword(dataToUpdate.password as string);
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    });
    return updatedUser as Pick<User, Key> | null;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number): Promise<User> => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await prisma.user.delete({ where: { id: user.id } });
    return user;
};

export default {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById
};
