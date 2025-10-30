import { userService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createUser = catchAsyncWithAuth(async (req, res) => {
    const { email, password, name, role } = req.body;
    const user = await userService.createUser(email, password, name, role);
    res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsyncWithAuth(async (req, res) => {
    const filter = pick(req.validatedQuery, ['name', 'role']);
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});

const getUser = catchAsyncWithAuth(async (req, res) => {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    // Check if user can access this data (own data or admin)
    if (userId !== currentUserId && req.user.role !== 'ADMIN') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden - Can only access own data');
    }

    const user = await userService.getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const updateUser = catchAsyncWithAuth(async (req, res) => {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    // Check if user can update this data (own data or admin)
    if (userId !== currentUserId && req.user.role !== 'ADMIN') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden - Can only update own data');
    }

    const user = await userService.updateUserById(userId, req.body);
    res.send(user);
});

const deleteUser = catchAsyncWithAuth(async (req, res) => {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    // Check if user can delete this account (own account or admin)
    if (userId !== currentUserId && req.user.role !== 'ADMIN') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden - Can only delete own account');
    }

    await userService.deleteUserById(userId);
    res.status(httpStatus.OK).send({});
});

export default {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
