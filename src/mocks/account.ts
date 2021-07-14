import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mock from 'src/utils/mock';
import wait from 'src/utils/wait';

const JWT_SECRET = 'jwt-secret';
const JWT_EXPIRES_IN = '7 days';

const users = [
  {
    id: '1',
    avatar: '/static/images/avatars/3.jpg',
    location: 'San Francisco, Romania',
    username: 'admin',
    email: 'demo@example.com',
    name: 'Randy Smith',
    jobtitle: 'Lead Developer',
    password: 'Demo123',
    role: 'admin',
    posts: '27'
  }
];

mock.onPost('/api/account/login').reply(async (config) => {
  try {
    await wait(1000);

    const { email, password } = JSON.parse(config.data);
    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [
        400,
        { message: 'Verify that your email and password are correct' }
      ];
    }

    if (user.password !== password) {
      return [400, { message: 'Invalid password' }];
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: user.id,
          avatar: user.avatar,
          jobtitle: user.jobtitle,
          email: user.email,
          name: user.name,
          location: user.location,
          username: user.username,
          role: user.role,
          posts: user.posts
        }
      }
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Encountered a server error' }];
  }
});

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await wait(1000);

    const { email, name, password } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);

    if (user) {
      return [400, { message: 'User already exists' }];
    }

    user = {
      id: uuidv4(),
      avatar: null,
      jobtitle: 'Lead Developer',
      email,
      username: null,
      name,
      password,
      location: null,
      role: 'admin',
      posts: '56'
    };

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return [
      200,
      {
        accessToken,
        user: {
          id: user.id,
          avatar: user.avatar,
          jobtitle: user.jobtitle,
          email: user.email,
          name: user.name,
          location: user.location,
          username: user.username,
          role: user.role,
          posts: user.posts
        }
      }
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Encountered a server error' }];
  }
});

mock.onGet('/api/account/personal').reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: 'Auth token is missing' }];
    }

    const accessToken = Authorization.split(' ')[1];
    const { userId } = jwt.verify(accessToken, JWT_SECRET) as any;
    const user = users.find((_user) => _user.id === userId);

    if (!user) {
      return [401, { message: 'Invalid auth token' }];
    }

    return [
      200,
      {
        user: {
          id: user.id,
          avatar: user.avatar,
          jobtitle: user.jobtitle,
          email: user.email,
          name: user.name,
          location: user.location,
          username: user.username,
          role: user.role,
          posts: user.posts
        }
      }
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Encountered a server error' }];
  }
});
