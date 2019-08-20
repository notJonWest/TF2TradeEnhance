contentSites["scrap.tf"] = () =>
{
	let errorCodes = {
		"ERROR.BOTID_URL": "Could not get bot's SteamID from URL",
		"ERROR.USERID": "Could not get user's SteamID",
		"ERROR.STORAGEBOT_INVENTORY": "Could not get storage bot's inventory"
	};
	//MY_STEAM_ID is used for adding steam inventory buttons to your own items (e.g. when selling)
	//So it is not too too important if it doesn't work. Currently, it does not work because the profile page renders
	//the steam link with JS, so normal webscrapping does not work (which is what I was doing)
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
		//If the object does not exist yet, create an empty one.
		if (localStorage.getItem("botSteamID64") === null)
			localStorage.setItem("botSteamID64", "{}");
		
		let getBotSteamID64 = () => JSON.parse(localStorage.getItem("botSteamID64"));
		//No need to check for null localstorage since we did that above and created it if it was null.
		//If the url is undefined, then we will use bp.tf's search engine to get it.
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
					cb(true, data.results[0].steamid64);
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
						cb(true, steamid64);
					})
					.catch(err =>
					{
						cb(false, err, errorCodes["ERROR.BOTID_URL"]);
					});
			})
			.catch(err =>
			{
				cb(false, err, errorCodes["ERROR.BOTID_URL"]);
			});
		}
		else
			cb(true, getBotSteamID64()[url]);
	};

	let getUserSteamLink = cb =>
	{
		if (userAddedID)
		{
			//Directly use provided ID instead of fetching it from scrap.tf
			cb(true, `https://steamcommunity.com/profiles/${MY_STEAM_ID}`);
		}
		else
		{
			//nav-userdropdown.href contains the link to the user's scrap.tf profile
			fetch(`https://cors-anywhere.herokuapp.com/${$$(".nav-userdropdown").href}`)
			.then(d => d.text())
			.then(d =>
			{
				let parsedHTML = htmlParser.parseFromString(d, "text/html");
				$$("html").parsed = parsedHTML;
				if (parsedHTML.querySelector(".stm.stm-steam") == null)
					cb(false, parsedHTML, errorCodes["ERROR.USERID"]);
				else
					cb(true, parsedHTML.querySelector(".stm.stm-steam").parentNode.href);
			})
			.catch(err =>
			{
				cb(false, err, errorCodes["ERROR.ERROR.USERID"]);
			});
		}
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
			cb(true, items);
		})
		.catch(err =>
		{
			cb(false, errorCodes["ERROR.STORAGEBOT_INVENTORY"], err);
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
		getUserSteamLink((valid_userlink, response_userlink, err_userlink) =>
		{
			if (!valid_userlink)
			{
				console.log(response_userlink, err_userlink);
			}

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
					
					//User applied Names/Descriptions are surrounded by "
					let hasName = item.getAttribute("data-title").indexOf("\"") !== -1;
					let hasDesc = dataContent.startsWith("\""); //Described items begin with the description
					if (hasName || hasDesc)
						item.insertAdjacentHTML("beforeend", `<span class="itemFraudWarning"></span>`);

					//the boxshadow stuff is a remnant of when I used to have a border for spelled items
					//it prevented part border and spell border from hiding each other
					//might need it again at some point, so I'm keeping it here
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
						else if (valid_userlink && isUserItem)
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
					getBotSteamIDByURL(botNumToID(botNum), (valid_botid, response_botid, err_botid) =>
					{
						if (valid_botid)
						{
							getStorageBotInvJSON(response_botid, (valid_inv, response_inv, err_inv) =>
							{
								if (valid_inv)
								{
									for (let itemId of itemsToSearch)
									{
										for (let asset of response_inv.assets)
										{
											if (asset.assetid === itemId)
											{
												createItemLink($$(`[data-id='${itemId}']`), getBotItemLink(itemId, botNum));
											}
										}
									}
								}
								else
									console.log(response_inv, err_inv)
							});
						}
						else
							console.log(response_botid, err_botid);
					});
				}
			}
		});
	};

	let useScrapTF = document.createElement("script");
	useScrapTF.src = chrome.extension.getURL("ScrapTF/useScrapTF.js");
	$$("body").appendChild(useScrapTF);
};