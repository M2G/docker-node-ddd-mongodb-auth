import t from 'tcomb';

const Users = t.struct({
  _id: t.Object,
  password_hash: t.String,
  username: t.String
});

export default Users;
