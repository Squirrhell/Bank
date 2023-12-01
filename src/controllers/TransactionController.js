const User = require('../models/User');
const Transaction = require('../models/Transaction');

class TransactionController {
    static async give(req, res) {
        const { id } = req.params;
        const { value } = req.body;

        try {
            const user_to = await User.findById(id);
            if (!user_to) {
                return res.status(404).json({ success: false, message: 'User '+id+' not found' });
            }

            if(value<0){
                return res.status(404).json({ success: false, message: 'Can\'t give negative value' });
            }

            const user_from = await User.findById(req.user._id);
            user_from.money-=value;
            user_to.money+=value;
            await user_from.save();
            await user_to.save();

            const newTransaction = new Transaction({
                type: 'give',
                user_from: req.user._id,
                user_to: id,
                value: value,
            });
            await newTransaction.save();

            res.status(200).json({ success: true, message: 'Transaction done', votes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async store(req, res) {
        const { value } = req.body;

        try {            
            if (value<0) {
                return res.status(404).json({ success: false, message: 'Can\'t store negative value' });
            }
                        
            const user_me = await User.findById(user._id);
            if (user_me) {
                return res.status(404).json({ success: false, message: 'Can\'t find you' });
            }
            user_me.money+=value;
            await user_me.save();

            const newTransaction = new Transaction({
                type: 'store',
                user_from: null,
                user_to: id,
                value: value,
            });
            await newTransaction.save();

            res.status(201).json({ success: true, message: 'Money stored', value: value });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async take(req, res) {
        const { id } = req.params;
        const { value } = req.body;

        try {
            const user_from = await User.findById(id);
            if (!user_from) {
                return res.status(404).json({ success: false, message: 'User '+id+' not found' });
            }

            const user_to = await User.findById(req.user._id);
            if(user_to.isShop) {
                return res.status(404).json({ success: false, message: 'Can\'t take money' });
            }

            if(value<0){
                return res.status(404).json({ success: false, message: 'Can\'t take negative value' });
            }

            user_from.money-=value;
            user_to.money+=value;
            await user_from.save();
            await user_to.save();

            const newTransaction = new Transaction({
                type: 'take',
                user_from: req.user._id,
                user_to: id,
                value: value,
            });
            await newTransaction.save();

            res.status(200).json({ success: true, message: 'Transaction done', votes });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = TransactionController;