export default async function handler(req, res) {
  const serverId = '1560559252475482122';
  const inviteCode = '6whU7guX9v';

  try {
    const [inviteRes, widgetRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`),
      fetch(`https://discord.com/api/v10/guilds/${serverId}/widget.json`)
    ]);

    if (!inviteRes.ok || !widgetRes.ok) throw new Error('Discord API Error');

    const inviteData = await inviteRes.json();
    const widgetData = await widgetRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    res.status(200).json({
      totalMembers: inviteData.approximate_member_count || 0,
      onlineMembers: widgetData.presence_count || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data Discord' });
  }
}
