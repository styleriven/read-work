enum UserRoles {
  Admin = 1,
  SystemAdmin = 2,
  User = 3,
}
export default UserRoles;

export const GetNameRole = (role: UserRoles) => {
  switch (role) {
    case UserRoles.Admin:
      return "Admin";
    case UserRoles.SystemAdmin:
      return "Admin hệ thống";
    case UserRoles.User:
      return "Người dùng";
    default:
      return "Không xác định";
  }
};

export const UserRolesArray = Object.values(UserRoles);

export type UserRole = UserRoles.User | UserRoles.SystemAdmin | UserRoles.Admin;
