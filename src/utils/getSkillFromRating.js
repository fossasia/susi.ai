export const getSkillFromRating = skillName => {
  let midLink = '';
  for (let i = 0; i < skillName.length; i++) {
    let character = skillName.charAt(i);
    if (character === character.toUpperCase() && i !== 0) {
      midLink += '_';
    }
    midLink += character.toLowerCase();
  }
  return midLink;
};
