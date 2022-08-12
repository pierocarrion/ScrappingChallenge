import schema from 'schm';

const profileSchema = schema({
    id: Number,
    name: String,
    educations: String,
    experience: String,
    contactInfo: String
})

export default profileSchema;