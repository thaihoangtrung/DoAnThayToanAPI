let contactModel = require('../schemas/contact');

module.exports = {
    GetAllContacts: async function () {
        return await contactModel.find().sort({ createdAt: -1 });
    },
    
    CreateContact: async function (name, email, phone, message) {
        let newContact = new contactModel({
            name,
            email,
            phone,
            message
        });
        return await newContact.save();
    },
    
    UpdateContactStatus: async function (id, status) {
        return await contactModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    },
    
    DeleteContact: async function (id) {
        return await contactModel.findByIdAndDelete(id);
    }
}; 