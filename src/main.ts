import { SetAlbums } from "./modules/music";
import { SetPresence } from "./modules/activity";
import { AddTabHighlight } from "./modules/tabs";
import { ThreeJS } from "./modules/scene";
import { HeroScroll, HeaderScroll, GSAP } from "./modules/scroll";
import { AddCardTilts, AddCardPointers } from "./modules/cards";
import { AddNorrisText } from "./modules/text";
import "@m3e/web/progress-indicator";
import { DC_UpdateToGamePresence } from "./discord.ts"

SetPresence();
SetAlbums();
AddTabHighlight();
ThreeJS();
HeroScroll();
HeaderScroll();
AddCardTilts();
AddCardPointers();
AddNorrisText();
GSAP();
