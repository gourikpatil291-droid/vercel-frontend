const { spawnSync } = require('child_process');

const email = 'gourikpatil291@gmail.com';

const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', 'EMAIL_USER', 'production'], {
    input: email + '\n', // Ensure newline
    encoding: 'utf-8',
    shell: true,
    stdio: ['pipe', 'inherit', 'inherit']
});

if (result.error) {
    console.error(result.error);
} else {
    console.log('Successfully injected email');
}
