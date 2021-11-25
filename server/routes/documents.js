const express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');
const { error } = require('console');

const router = express.Router();

// Get list of documents
router.get('/', (req, res, next) => {
    // call the Document model find() to get all documents
    const documents = Document.find();
    if (error) {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    }
    res.status(200).json({
        // return a JSON object containing list of documents
        message: 'Retrieved documents successfully',
        documents: documents
    });
})

// Create new document
router.post('/', (req, res, next) => {
    const maxDocumentId = sequenceGenerator.nextId("documents");
    const document = new Document({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    });
    document.save()
        .then(createdDocument => {
            res.status(201).json({
                message: 'Document added successfully',
                document: createdDocument
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        });
});

// Update existing document
router.put('/', (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            document.name = req.body.name;
            document.description = req.body.description;
            document.url = req.body.url;

            Document.updateOne({ id: req.params.id }, document)
                .then(result => {
                    res.status(204).json({
                        message: 'Document updated successfully'
                    })
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'An error occurred',
                        error: error
                    });
                });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Document not found.',
                error: { document: 'Document not found' }
            });
        });
});

// Delete document
router.delete('/', (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            Document.deleteOne({ id: req.params.id })
                .then(result => {
                    res.status(204).json({
                        message: 'Document deleted successfully'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'An error occurred',
                        error: error
                    });
                })
        })
        .catch(error => {
            res.status(500).json({
                message: 'Document not found.',
                error: { document: 'Document not found' }
            });
        });
});

module.exports = router;