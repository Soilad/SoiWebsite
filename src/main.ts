import { SetNowPlaying, SetAlbums } from "./modules/music";
import { AddTabHighlight } from "./modules/tabs";
import { ThreeJS } from "./modules/scene";
import { HeroScroll, HeaderScroll, GSAP } from "./modules/scroll";
import { AddCardTilts, AddCardPointers } from "./modules/cards";
import { AddNorrisText } from "./modules/text";

SetNowPlaying();
SetAlbums();
AddTabHighlight();
ThreeJS();
HeroScroll();
HeaderScroll();
AddCardTilts();
AddCardPointers();
AddNorrisText();
GSAP();
