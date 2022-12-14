const Joi =require('joi')
 const validateUserDetail=(user)=>{
    const schema = Joi.object({
        name:Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        avtar:Joi.string(),
        date:Joi.date()
    });
    return schema.validate(user);
}
const validateUserAuthDetail=(auth)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().exist(),
    });
    return schema.validate(auth);
    
}

const validateUserProfileDetail=(profile)=>{
    const schema = Joi.object({
         user: Joi.string(),
        company:Joi.string(),
         website:Joi.string(),
         location:Joi.string(),
        status:Joi.string().required(),
        skills:Joi.string().required(),
        bio:Joi.string(),
        githubusername:Joi.string(),
        experience:Joi.array(),
        education:Joi.array(),
        youtube:Joi.string(),
        twitter:Joi.string(),
        facebook:Joi.string(),
        linkedin:Joi.string(),
        instragram:Joi.string(),
        date:Joi.date()

    });
    return schema.validate(profile);
}
const validateUserExperienceDetail=(exp)=>{

    const schema = Joi.object({
        title:Joi.string().required(),
        company:Joi.string().required(),
        location:Joi.string(),
        from:Joi.date().required(),
        to:Joi.date(),
        current:Joi.boolean(),
        description:Joi.string()
    })
    return schema.validate(exp);
    }

    const validateUserEducationDetail=(edu)=>{
        const schema = Joi.object({
        school:Joi.string().required(),
        degree:Joi.string().required(),
        fieldofstudy:Joi.string().required(),
        from:Joi.date().required(),
        to:Joi.date(),
        current:Joi.boolean(),
        description:Joi.string() })

    return schema.validate(edu);
    }

module.exports ={validateUserDetail,validateUserAuthDetail,validateUserProfileDetail,validateUserExperienceDetail,validateUserEducationDetail}