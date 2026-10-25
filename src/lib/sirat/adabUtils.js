// সীরাত.ব্লগ — Islamic Scholarly Adab & Relationship Terminology Helper
// আদব ও ইলমী মর্যাদাভিত্তিক গতিশীল পরিভাষা ইঞ্জিন

/**
 * Calculates the seniority rank of an author or user
 * Rank 3: শায়খ / ড. / অধ্যাপক / মুফতী (Senior Scholar)
 * Rank 2: উস্তায / উস্তাযা / গবেষক (Mid-level Scholar)
 * Rank 1: শিক্ষার্থী / তরুণ লেখক / সাধারণ পাঠক (Junior / Student / Reader)
 */
export function getSeniorityRank(person) {
  if (!person) return 1;
  
  if (person.seniorityRank) return person.seniorityRank;

  const name = person.displayName || person.name || '';
  const bio = person.bio || '';
  const expertise = person.expertise || '';

  if (
    name.includes('শায়খ') ||
    name.includes('ড.') ||
    name.includes('অধ্যাপক') ||
    name.includes('মুফতী') ||
    bio.includes('অধ্যাপক') ||
    bio.includes('তিন দশক') ||
    bio.includes('দুই দশক')
  ) {
    return 3; // Senior Scholar
  }

  if (
    name.includes('উস্তায') ||
    name.includes('উস্তাযা') ||
    name.includes('মাওলানা') ||
    bio.includes('গবেষক') ||
    bio.includes('মাস্টার্স')
  ) {
    return 2; // Mid-level Scholar
  }

  return 1; // Junior / Student / General
}

/**
 * Returns dynamic Islamic Adab action labels based on relative seniority
 * @param {Object} currentUser - The currently active user / commenter
 * @param {Object} targetPerson - The author of the post or parent comment
 * @param {boolean} isReplying - Whether replying to an existing comment
 */
export function getAdabTerminology({ currentUser = { name: 'মুফতী আব্দুল্লাহ', seniorityRank: 2 }, targetPerson, isReplying = false }) {
  const userRank = getSeniorityRank(currentUser);
  const targetRank = getSeniorityRank(targetPerson);

  const targetName = targetPerson?.displayName || targetPerson?.name || 'লেখক';

  // 1. কনিষ্ঠ ব্যক্তি যখন জ্যেষ্ঠ শায়খ/স্কলারের কাছে লিখছেন (Junior -> Senior)
  if (userRank < targetRank || targetRank === 3) {
    return {
      type: 'junior_to_senior',
      actionBtnLabel: 'আরজ',
      replyBtnLabel: 'আরজ পেশ',
      replyingBannerText: `${targetName}-এর খেদমতে আরজ পেশ করছেন`,
      inputPlaceholder: `সম্মানিত ${targetName}-এর খেদমতে আপনার ইলমী আরজ বা জিজ্ঞাসা লিখুন...`,
      submitTooltip: 'আরজ পেশ করুন',
      categoryTag: 'ইলমী আরজ',
    };
  }

  // 2. জ্যেষ্ঠ স্কলার যখন কনিষ্ঠ বা শিক্ষার্থীর উদ্দেশ্যে লিখছেন (Senior -> Junior)
  if (userRank > targetRank) {
    return {
      type: 'senior_to_junior',
      actionBtnLabel: 'প্রস্তাবনা',
      replyBtnLabel: 'প্রস্তাবনা',
      replyingBannerText: `${targetName}-কে দিকনির্দেশনা বা প্রস্তাবনা দিচ্ছেন`,
      inputPlaceholder: `স্নেহভাজন ${targetName}-এর উদ্দেশ্যে আপনার প্রস্তাবনা বা নসিহত লিখুন...`,
      submitTooltip: 'প্রস্তাবনা পেশ করুন',
      categoryTag: 'প্রস্তাবনা',
    };
  }

  // 3. সমমর্যাদার স্কলারদের পারস্পরিক ইলমী আলোচনা (Peer to Peer)
  return {
    type: 'peer_to_peer',
    actionBtnLabel: 'মন্তব্য',
    replyBtnLabel: 'মতামত',
    replyingBannerText: `${targetName}-এর মন্তব্যে আলোচনা যোগ করছেন`,
    inputPlaceholder: `আপনার মূল্যবান ইলমী মতামত ও মন্তব্য লিখুন...`,
    submitTooltip: 'মন্তব্য পাঠান',
    categoryTag: 'মন্তব্য',
  };
}
