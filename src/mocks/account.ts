import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mock from 'src/utils/mock';
import wait from 'src/utils/wait';
import { authService, userService, HttpService } from 'src/services';

const JWT_SECRET = 'secretKey';
// const JWT_SECRET = 'jwt-secret';
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

    let data = {
      identifier: email,
      password: password
    }
    let response = await authService.login(data);
    // const user = users.find((_user) => _user.email === email);

    if (!response || !response.data || !response.data.data) {
      return [
        400,
        { message: 'Verify that your email and password are correct' }
      ];
    }

    const {access_token, user} = response.data.data ;
    console.log('---access_token from server----', access_token);
    //let pp = jwt.verify(access_token, 'secretKey') as any;
    //console.log('-------pp----',pp);
    // {email: "cmate5614530@gmail.com", sub: "60ee0eaebb920c160028fc43", iat: 1626372780, exp: 1657908780}
    // const accessToken = jwt.sign({ user: user}, JWT_SECRET, {
    //   expiresIn: JWT_EXPIRES_IN
    // });
    return [
      200,
      {
        accessToken:access_token,
        user: user
      }
    ];
  } catch (err) {
    //console.error(err);
    return [500, { message: 'Encountered a server error' }];
  }
});

mock.onPost('/api/account/register').reply(async (config) => {
  try {
    await wait(1000);

    const { email, name, password } = JSON.parse(config.data);
    let user = users.find((_user) => _user.email === email);
    let data = {
      email: email,
      name: name,
      password: password
    }
    //let response = await authService.signUp(data);
    //console.log('---response--', response);
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
    HttpService.setToken(accessToken);
    const { email, sub } = jwt.verify(accessToken, JWT_SECRET) as any;
    console.log('----------mocks/accounts-------', email, sub, accessToken);

    userService.user(sub).then(({data})=>{
        console.log('+++++', data);
        let user = data.data;
      
        return [
          200,
          {
            user: user
          }
        ];
    },({response})=>{
        console.log('++++++++', response);
        return [401, { message: 'Invalid auth token' }];
    })
    
  } catch (err) {
    console.error(err);
    return [500, { message: 'Encountered a server error' }];
  }
});
