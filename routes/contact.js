var express = require('express');
var router = express.Router();
var contactController = require('../controllers/contact');
let { CreateSuccessRes } = require('../utils/responseHandler');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constants = require('../utils/constants');

// Tạo contact mới (Public API)
router.post('/', async function(req, res, next) {
    try {
        let { name, email, phone, message } = req.body;
        let newContact = await contactController.CreateContact(
            name,
            email,
            phone,
            message
        );
        CreateSuccessRes(res, newContact, 201);
    } catch (error) {
        next(error);
    }
});

// Lấy danh sách contact (Admin only)
router.get('/', 
    check_authentication,
    check_authorization(constants.ADMIN_PERMISSION),
    async function(req, res, next) {
        try {
            let contacts = await contactController.GetAllContacts();
            CreateSuccessRes(res, contacts, 200);
        } catch (error) {
            next(error);
        }
    }
);

// Cập nhật trạng thái contact (Admin only)
router.put('/:id/status',
    check_authentication,
    check_authorization(constants.ADMIN_PERMISSION),
    async function(req, res, next) {
        try {
            let updatedContact = await contactController.UpdateContactStatus(
                req.params.id,
                req.body.status
            );
            CreateSuccessRes(res, updatedContact, 200);
        } catch (error) {
            next(error);
        }
    }
);

// Xóa contact (Admin only)
router.delete('/:id',
    check_authentication,
    check_authorization(constants.ADMIN_PERMISSION),
    async function(req, res, next) {
        try {
            await contactController.DeleteContact(req.params.id);
            CreateSuccessRes(res, { message: 'Contact deleted successfully' }, 200);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router; 