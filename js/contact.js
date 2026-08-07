const discordBtn = document.getElementById('discord-copy');
const discordLabel = document.getElementById('discord-label');

if (discordBtn)
{
    discordBtn.addEventListener('click', async () =>
    {
        const tag = discordBtn.dataset.tag;

        try
        {
            await navigator.clipboard.writeText(tag);
            discordLabel.textContent = 'Copied to clipboard!';
        }
        catch
        {
            discordLabel.textContent = `${tag} (copy failed — copy manually)`;
        }

        setTimeout(() =>
        {
            discordLabel.textContent = `Discord - ${tag}`;
        }, 2000);
    });
}