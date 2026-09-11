import pippinBill from '../assets/showcase/reviews-engine/current/pippin-bill.jpg';
import ernestineJennifer from '../assets/showcase/reviews-engine/current/ernestine-jennifer.jpg';
import lolaAj from '../assets/showcase/reviews-engine/current/lola-aj.jpg';
import griffeySkyler from '../assets/showcase/reviews-engine/current/griffey-skyler.jpg';

// Exact publicly displayed SkyPups text, names, locations, and five-paw ratings.
// Verified against https://www.skypupstreats.com/reviews on 2026-09-11.
// Public display establishes source provenance; Production publication remains founder-gated.
export const currentSkyPupsReviews = [
  {
    id: 'skypups-ernestine-jennifer',
    image: ernestineJennifer,
    imagePosition: '50% 70%',
    name: 'Ernestine & Jennifer',
    location: 'Bellingham, WA',
    paws: 5,
    quote: 'I love the fact that you are small, family owned, locally sourced and local! So, win/win!',
  },
  {
    id: 'skypups-lola-aj',
    image: lolaAj,
    imagePosition: '50% 50%',
    name: 'Lola & AJ',
    location: 'Edmonds, WA',
    paws: 5,
    quote: 'I bought the dehydrated chicken snacks at the Edmonds farmers market for my 13-year-old Pomeranian, who is extremely picky. She loves them, and I am relieved to have finally found treats she actually wants.',
  },
  {
    id: 'skypups-griffey-skyler',
    image: griffeySkyler,
    imagePosition: '50% 50%',
    name: 'Griffey & Skyler',
    location: 'Seattle, WA',
    paws: 5,
    quote: 'It was so nice meeting people who clearly love dogs and care about what they make. Griffey is obsessed with the salmon treats and now waits for the chicken samples every Sunday at Fremont.',
  },
  {
    id: 'skypups-pippin-bill',
    image: pippinBill,
    imagePosition: '50% 50%',
    name: 'Pippin & Bill',
    location: 'Meredith, NH',
    paws: 5,
    quote: "Hi Michele, the salmon tails and bonus treats arrived a few days ago but I just retrieved them today from the mail room. Well, it's an understatement to say Pippin was engaged! See pix. I also shared a few treats with our Aussie neighbors, Rika and Reese, who loved them. Thx and I'll be back! Bill",
  },
] as const;
