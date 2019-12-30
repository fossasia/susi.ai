const getSkillNameFromSkillTag = skillTag => {
  var name = skillTag.replace(/_/g, ' ');
  var regularExpression = /(\b[a-z](?!\s))/g;
  name = name.replace(regularExpression, function(x) {
    return x.toUpperCase();
  });
  return name;
};
export default getSkillNameFromSkillTag;
