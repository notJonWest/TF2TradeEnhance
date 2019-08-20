contentSites["steamcommunity.com"] = () =>
{
	refreshReadability = () =>
	{
		for (let item of [...$$All(".item")])
		{
			console.log(item.rgItem);
		}
	}
}