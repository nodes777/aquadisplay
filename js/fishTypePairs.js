var fishTypePairs = {
	"fwanabantoid": "Non-Betta Anabantoids",
	"fwbettasct": "Crowntail Bettas",
	"fwbettasd": "Deltatail Bettas",
	"fwbettasdt": "Doubletail Bettas",
	"fwbettashm": "Halfmoon Bettas",
	"fwbettashmp": "Halfmoon Plakat Bettas",
	"fwbettasvt": "Veiltail Bettas",
	"fwbettaswt": "Plakat Bettas",
	"fwbettas": "Wildtype Bettas",
	"fwarowana": "Arowana",
	"fwcatfishc": "Cory Catfish",
	"fwcatfishp": "Pleco Catfish",
	"fwcatfish": "Other Catfish",
	"fwcharacins": "Characins",
	"fwcichlidsmh": "Malawi Haplochromine Cichlids",
	"fwcichlidsmmb": "Malawi Mbuna Cichlids",
	"fwcichlidsmp": "Malawi Peacock Cichlids",
	"fwcichlidsm": "Other Malawi Cichlids",
	"fwcichlidst": "Tanganyika Cichlids",
	"fwcichlidsv": "Victoria Cichlids",
	"fwcichlidsw": "Western Africa Cichlids",
	"fwcichlidc": "Central America Cichlids",
	"fwangelfish": "Angelfish",
	"fwapisto": "Apistos",
	"fwdiscus": "Discus",
	"fwcichlidso": "Other Cichlids",
	"fwcyprinids": "Cyprinids",
	"fwflowerhorn": "Flowerhorn Cichlids",
	"fwgoldfish": "Goldfish",
	"fwguppies": "Guppies",
	"fwinverts": "Invertabrates",
	"fwkillifish": "Killifish",
	"fwkillifishe": "Killifish Eggs",
	"fwkoi": "Koi",
	"fwlivebearers": "Domesticated Livebearers",
	"fwlivebearersw": "Wildtype Livebearers",
	"fwcatfishl": "Loaches",
	"fwrainbows": "Rainbowfish",
	"fwsnails": "Snails",
	"fwstringray": "Stingrays",
	"fwusnative": "US Native Fish",
	"fw": "Other Freshwater Fish",
	"fwmixed":"Mixed Lots",
	"Avg" : "Averages"
};

function getReadableName(string) {
	var name = fishTypePairs[string];
    return name;
}