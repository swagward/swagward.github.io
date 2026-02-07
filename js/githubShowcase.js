async function fetchGithubActivity()
{
    const username = 'swagward';
    const container = document.getElementById('github-activity');

    try
    {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`);

        if (!response.ok) return;

        const data = await response.json();
        const lastEvent = data.find(event => event.type === "PushEvent" || event.type === "CreateEvent");

        if (lastEvent && lastEvent.type === "PushEvent")
        {
            const repo = lastEvent.repo.name.split('/')[1];
            const msg = lastEvent.payload.commits[0].message;
            container.innerHTML = `> Pushed to <strong>${repo}</strong>: "${msg}"`;
        }
        else if (lastEvent && lastEvent.type === "CreateEvent")
        {
            const repo = lastEvent.repo.name.split('/')[1];
            container.innerHTML = `> Created new repository: <strong>${repo}</strong>`;
        }
        else
        {
            //fallback if no activity found
            container.innerHTML = "> status: idle // awaiting next commit";
        }
    }
    catch (e)
    {
        container.innerHTML = "> status: offline // localized dev in progress";
    }
}
fetchGithubActivity();