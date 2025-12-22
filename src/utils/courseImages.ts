// Import all course hero images
import pebbleBeachHero from '../assets/images/Courses/pebble-beach_hero.jpg'
import augustaNationalHero from '../assets/images/Courses/augusta-national_hero.jpg'
import stAndrewsHero from '../assets/images/Courses/st-andrews_hero.jpg'
import pinehurstNo2Hero from '../assets/images/Courses/pinehurst-no2_hero.webp'
import cypressPointHero from '../assets/images/Courses/cypress-point_hero.jpg'
import oakmontHero from '../assets/images/Courses/oakmont_hero.jpg'
import merionEastHero from '../assets/images/Courses/merion-east_hero.jpg'
import shinnecockHillsHero from '../assets/images/Courses/shinnecock-hills_hero.webp'
import bethpageBlackHero from '../assets/images/Courses/bethpage-black_hero.jpg'
import royalCountyDownHero from '../assets/images/Courses/royal-county-down_hero.webp'
import royalDornochHero from '../assets/images/Courses/royal-dornoch_hero.webp'
import royalMelbourneHero from '../assets/images/Courses/royal-melbourne_hero.jpg'
import royalPortrushHero from '../assets/images/Courses/royal-portrush_hero.jpg'
import carnoustieHero from '../assets/images/Courses/carnoustie_hero.jpg'
import muirfieldHero from '../assets/images/Courses/muirfield_hero.jpg'
import turnberryHero from '../assets/images/Courses/turnberry_hero.jpg'
import royalBirkdaleHero from '../assets/images/Courses/royal-birkdale_hero.jpg'
import royalTroonHero from '../assets/images/Courses/royal-troon_hero.webp'
import bandonDunesHero from '../assets/images/Courses/bandon-dunes_hero.webp'
import pacificDunesHero from '../assets/images/Courses/pacific-dunes_hero.jpg'
import kiawahOceanHero from '../assets/images/Courses/kiawah-ocean_hero.jpg'
import torreyPinesSouthHero from '../assets/images/Courses/torrey-pines-south_hero.jpeg'
import tpcSawgrassHero from '../assets/images/Courses/tpc-sawgrass_hero.jpg'
import harbourTownHero from '../assets/images/Courses/harbour-town_hero.jpg'
import spyglassHillHero from '../assets/images/Courses/spyglass-hill_hero.jpg'
import cabotCliffsHero from '../assets/images/Courses/cabot-cliffs_hero.webp'
import sandHillsHero from '../assets/images/Courses/sand-hills_hero.jpg'
import shadowCreekHero from '../assets/images/Courses/shadow-creek_hero.webp'
import rivieraHero from '../assets/images/Courses/riviera_hero.jpg'

// Default fallback images
import rangeScreenImage from '../assets/images/Range screen.png'
import launcherImage from '../assets/images/Launcher.png'

export const courseImages: Record<string, string> = {
  'pebble-beach': pebbleBeachHero,
  'augusta-national': augustaNationalHero,
  'st-andrews': stAndrewsHero,
  'pinehurst-no2': pinehurstNo2Hero,
  'cypress-point': cypressPointHero,
  'oakmont': oakmontHero,
  'merion-east': merionEastHero,
  'shinnecock-hills': shinnecockHillsHero,
  'bethpage-black': bethpageBlackHero,
  'royal-county-down': royalCountyDownHero,
  'royal-dornoch': royalDornochHero,
  'royal-melbourne': royalMelbourneHero,
  'royal-portrush': royalPortrushHero,
  'carnoustie': carnoustieHero,
  'muirfield': muirfieldHero,
  'turnberry': turnberryHero,
  'royal-birkdale': royalBirkdaleHero,
  'royal-troon': royalTroonHero,
  'bandon-dunes': bandonDunesHero,
  'pacific-dunes': pacificDunesHero,
  'kiawah-ocean': kiawahOceanHero,
  'torrey-pines-south': torreyPinesSouthHero,
  'tpc-sawgrass': tpcSawgrassHero,
  'harbour-town': harbourTownHero,
  'spyglass-hill': spyglassHillHero,
  'cabot-cliffs': cabotCliffsHero,
  'sand-hills': sandHillsHero,
  'shadow-creek': shadowCreekHero,
  'riviera': rivieraHero,
}

export const defaultImages = {
  range: rangeScreenImage,
  launcher: launcherImage,
}

export const getCourseImage = (courseId: string): string => {
  return courseImages[courseId] || defaultImages.launcher
}


