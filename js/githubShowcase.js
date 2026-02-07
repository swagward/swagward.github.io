async function fetchGithubActivity()
{
    const username = 'swagward';
    const container = document.getElementById('github-activity');
    try
    {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`);
        console.log(`Github API Error: ${response.status}`);

        const data = await response.json();
        const pushEvent = data.find(event => event.type === "PushEvent");

        if(pushEvent)
        {
            const repo = pushEvent.repo.name.split('/')[1];
            const msg = pushEvent.payload.commits[0].message;
            container.innerHTML = `> Pushed to <strong>${repo}</strong>: "${msg}"`;
        }
    }
    catch (e)
    {
        container.innerHTML = "> Systems nominal. Coding in progress.";
    }
}
fetchGithubActivity();