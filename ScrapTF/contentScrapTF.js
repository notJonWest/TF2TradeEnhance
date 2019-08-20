contentSites["scrap.tf"] = () =>
{
	//MY_STEAM_ID is used for adding steam inventory buttons to your own items (e.g. when selling)
	//So it is not too too important if it doesn't work. It should still work in most cases, but according to
	//an old comment by me, scrap.tf has a cors block whatever, so it doesn't work because of that?
	//Solution: I'm just going to add a boolean check around the code that uses MY_STEAM_ID. I will advertise that people
	//can edit the code to put in their own id to make it work more often.
	const MY_STEAM_ID = '76561198262727995'; //REPLACE THIS WITH YOUR OWN STEAM ID
	let userAddedID = false; //CHANGE THIS TO TRUE IF YOU HAVE ENTERED YOUR OWN ID ABOVE
	let userStorageBots = 
	[
		42, //1
		43, //2
		63, //3
		//null, //4 does not exist
		71, //5
		72, //6
		73, //7
		74, //8
		75, //9
		76, //10
		83, //11
		84, //12
		85, //13
		86, //14
		87, //15
		88, //16
		"scraptf88", //17
		90, //18
		91, //19
		92, //20
		93, //21
		100, //22
		101, //23
		102, //24
		103, //25
		104, //26
		105, //27
		106 //28
	];

	let raffleStorageBots = 
	[
		56, //1
		57,
		58,
		59,
		60, //5
		61,
		77,
		78,
		79,
		80, //10
		81
	];

	let htmlParser = new DOMParser();

	let getBotSteamIDByURL = (url, cb) =>
	{
		if (localStorage.getItem("botSteamID64") === null)
			localStorage.setItem("botSteamID64", "{}");
		
		let getBotSteamID64 = () => JSON.parse(localStorage.getItem("botSteamID64"));
		if (getBotSteamID64()[url] === undefined)
		{
			fetch(`https://cors-anywhere.herokuapp.com/https://backpack.tf/search?text=${url}`)
			.then(data=>data.json())
			.then(data=>
			{
				if (data.results.length > 0)
				{
					let botSteamID64 = getBotSteamID64();
					botSteamID64[url] = data.results[0].steamid64;
					localStorage.setItem("botSteamID64", JSON.stringify(botSteamID64));
					cb(data.results[0].steamid64);
				}
				else
					fetch(`https://cors-anywhere.herokuapp.com/https://backpack.tf/im_feeling_lucky?text=${url}`)
					.then(data=>data.text())
					.then(data=>
					{
						let parsedHTML = htmlParser.parseFromString(data, "text/html");
						let profileLink = parsedHTML.querySelector(`.profile .information .avatar-container a`).href;
						let steamid64 = profileLink.substring(profileLink.lastIndexOf("/") + 1);
						
						let botSteamID64 = getBotSteamID64();
						botSteamID64[url] = steamid64;
						localStorage.setItem("botSteamID64", JSON.stringify(botSteamID64));
						cb(steamid64);
					});
			});
		}
		else
			cb(getBotSteamID64()[url]);
	};

	let getUserSteamLink = cb =>
	{
		//* ADD/REMOVE THE FIRST 1 / ON THIS LINE TO TOGGLE WHAT CODE IS USED
		// If you do not care if you cannot go to the steam inventory page of your own items
		// you can drastically reduce wait times by adding the /. If you do care,
		// then remove the /.
		// TL;DR: Begin that first line with "//*" for slow, but more "user-friendly*"
		// OR begin it with "/*" to make it faster.
		// *user-friendly in this case means that the MY_STEAM_ID could be wrong and it will still work.
		fetch(`https://cors-anywhere.herokuapp.com/${$$(".nav-userdropdown").href}`)
		.then(d => d.text())
		.then(d =>
		{
			let parsedHTML = htmlParser.parseFromString(d, "text/html");
			if (parsedHTML.querySelector(".stm.stm-steam") == null)
				//Recently (04/03/2019) scrap.tf put up a CORS block, so that caused some issues)
				cb(`https://steamcommunity.com/profiles/${MY_STEAM_ID}`);
			else
				cb(parsedHTML.querySelector(".stm.stm-steam").parentNode.href);
		})
		.catch(e =>
		{
			cb(`https://steamcommunity.com/profiles/${MY_STEAM_ID}`);
		});
		//*/cb(`https://steamcommunity.com/profiles/${MY_STEAM_ID}`);//*/
	}

	let getUserItemLink = (steamLink, itemId) =>
	{
		return steamLink + `/inventory#440_2_${itemId}`;
	};

	let getStorageBotInvJSON = (steamid64, cb) =>
	{
		fetch(`https://cors-anywhere.herokuapp.com/${getBotInvLink(steamid64)}`)
		.then(data=>data.json())
		.then(items =>
		{
			cb(items);
		})
		.catch(err =>
		{
			console.log(err);
			cb({"assets":[]});
		});
	};

	let botNumToID = num =>
	{
		if (typeof(num) === "number")
			return "tf2scrap" + num;
		else
			return num;
	};

	let getBotInvLink = steamid64 =>
	{	
		return `https://steamcommunity.com/inventory/${steamid64}/440/2?l=english&count=3000`;
	};

	let getBotItemLink = (itemId, botNum) =>
	{
		botNum = botNumToID(botNum);
		
		return `https://steamcommunity.com/id/${botNum}/inventory#440_2_${itemId}`;
	};

	let createItemLink = (item, itemLink) =>
	{
		item.setAttribute("data-content", item.getAttribute("data-content") + `
		<a target="_blank" href="${itemLink}"><button class="btn btn-embossed btn-inverse btn-xs">Steam</button></a>`);
	};

	refreshReadability = () =>
	{
		getUserSteamLink(userSteamLink =>
		{
			let itemsToSearch = [];
			for (let item of [...$$All(".item")])
			{
				if (!item.parentNode.parentNode.parentNode.classList.contains("search-outside"))
				{
					let dataContent = item.getAttribute("data-content");
					
					let craftIndex = dataContent.indexOf("Craft #") + 6;
					if (craftIndex !== 5)
					{
						if (item.querySelector("div.cratetext") !== null)
							item.querySelector("div.cratetext").style.display = "none";
						let craft = dataContent.substring(craftIndex, dataContent.indexOf("<", craftIndex));
						item.insertAdjacentHTML("beforeend", `<span class='itemCraft'>${craft}</span>`);
					}
					
					let lvlIndex = dataContent.indexOf("Level ") + 6;
					if (lvlIndex !== 5)
					{
						let lvl = dataContent.substring(lvlIndex, dataContent.indexOf("<", lvlIndex));
						item.insertAdjacentHTML("beforeend", `<span class='itemLvl'>Lvl${lvl}</span>`);
					}
					
					let nameIndex = item.getAttribute("data-title").indexOf("\"");
					let descIndex = dataContent.indexOf("\"");
					if (nameIndex !== -1 || descIndex !== -1)
					{
						item.insertAdjacentHTML("beforeend", `<span class="itemFraudWarning"></span>`);
					}
					let boxShadowSize = 0;
					let boxShadowComma = "";
					
					let partIndex = dataContent.indexOf("<span style='color:#CF6A32'>Strange Part:");
					if (partIndex !== -1)
					{
						boxShadowSize++;
						item.style.boxShadow += `${boxShadowComma}0 0 0 ${boxShadowSize*2}pt #0c0`;
						boxShadowComma = ", ";
					}
					
					if (location.pathname.substring(0, 10) === "/auctions/" ||
						location.pathname.substring(0, 11) === "/megaraffle" ||
						location.pathname.substring(0, 9) === "/raffles/")
					{
						if (item.classList.contains("quality11") || item.classList.contains("quality15"))
						{
							itemsToSearch.push(item.getAttribute("data-id"));
						}
					}
					else
					{
						let itemId = item.getAttribute("data-id");
						let botNum = null;
						let isUserItem = false;
						if (location.pathname === "/buy/skins")
						{
							if ($$("#buy-container").contains(item))
							{
								botNum = item.getAttributeNames().find(item=>/^data-bot\d+-count$/.test(item));
								let numIndex = botNum.indexOf("bot") + 3;
								botNum = parseInt(botNum.substring(numIndex, botNum.indexOf("-", numIndex)));
							}
							else if ($$("#sell-container").contains(item))
							{
								isUserItem = true;
							}
							else
								console.log(item);
						}
						else if (location.pathname.substring(0, 7) === "/skins/")
						{
							botNum = parseInt(location.pathname.substring(7));
						}
						
						if (botNum !== null)
						{
							createItemLink(item, getBotItemLink(itemId, botNum));
						}
						else if (isUserItem)
						{
							createItemLink(item, getUserItemLink(userSteamLink, itemId));
						}
					}
				}
			}
			
			let storageGroup = [];
			if (location.pathname.substring(0, 10) === "/auctions/" ||
				location.pathname.substring(0, 11) === "/megaraffle")
				storageGroup = userStorageBots;
			else if (location.pathname.substring(0, 9) === "/raffles/")
				storageGroup = raffleStorageBots;
			
			for (let botNum of storageGroup)
			{
				if (botNum !== null)
				{
					getBotSteamIDByURL(botNumToID(botNum), id =>
					{
						getStorageBotInvJSON(id, inv =>
						{
							for (let itemId of itemsToSearch)
							{
								for (let asset of inv.assets)
								{
									if (asset.assetid === itemId)
									{
										createItemLink($$(`[data-id='${itemId}']`), getBotItemLink(itemId, botNum));
									}
								}
							}
						});
					});
				}
			}
		});
	};

	let useScrapTF = document.createElement("script");
	useScrapTF.src = chrome.extension.getURL("ScrapTF/useScrapTF.js");
	$$("body").appendChild(useScrapTF);
};