export async function getContributors() {
  const data = [
    {
      avatar: 'https://avatars3.githubusercontent.com/u/contributer1_avatar',
      github: 'https://github.com/contributer1',
      name: 'contributer1',
    },
    {
      avatar: 'https://avatars0.githubusercontent.com/u/contributer2_avatar',
      github: 'https://github.com/contributer2',
      name: 'contributer2',
    },
  ];

  return new Promise((resolve, reject) => {
    resolve(data);
  });
}
