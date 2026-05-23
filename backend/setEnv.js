const { spawnSync } = require('child_process');

const password = 'wggewgwddwfxbaqb';

const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', 'EMAIL_PASS', 'production'], {
    input: password + '\n', // Ensure newline
    encoding: 'utf-8',
    shell: true, // Use shell to fix EINVAL
    stdio: ['pipe', 'inherit', 'inherit']
});

if (result.error) {
    console.error(result.error);
} else {
    console.log('Successfully injected password');
}
