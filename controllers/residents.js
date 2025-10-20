const Resident = require('../models/Resident');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');

const getAllResidents = async(req, res) => {

  let results = Resident.find({createdBy: req.user.userId}).sort('lastName');
  // const residents = await Resident.find({createdBy: req.user.userId}).sort('lastName');

  // //gets total documents
  const totalResults = await Resident.countDocuments({});

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const residents = await results;
  

  res.status(StatusCodes.OK).json({
    residents, 
    count: residents.length,
    totalResults: totalResults
  });
}

const getResident = async(req, res) => {
  const {user: {userId}, params: {id:residentId}} = req;

  const resident = await Resident.findOne({
    _id:residentId,
    createdBy: userId
  });

  if(!resident) {
    throw new NotFoundError(`No jobs with id ${residentId}`);
  };
  res.status(StatusCodes.OK).json({resident});
};

const createResident = async(req, res) => {
  req.body.createdBy = req.user.userId;
  const resident = await Resident.create(req.body);
  res.status(StatusCodes.CREATED).json({resident});
};

//fields: firstName, middleName, lastName, gender, dateOfBirth, status, hospice, roomNumber
const updateResident = async(req, res) => {
  const {
    user: {userId},
    params: {id:residentId},
    body: {firstName, middleName, lastName, gender, dateOfBirth, status, hospice, roomNumber}
  } = req;

  if(firstName === '' ||
     lastName === '' ||
     dateOfBirth === '' ||
     roomNumber === '') {
      throw new BadRequestError('Fields cannot be empty');
     };
  
  const updatedResident = await Resident.findByIdAndUpdate(
    { _id: residentId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if(!updatedResident) {
    throw new NotFoundError(`No resident with id ${residentId}`);
  };

  res.status(StatusCodes.OK).json({updatedResident});
};

const deleteResident = async(req, res) => {
  const {user: {userId}, params: {id: residentId}} = req;
  const removedResident = await Resident.findByIdAndDelete({
    _id:residentId,
    createdBy: userId
  });

  if(!removedResident) {
    throw new NotFoundError(`No resident with id ${residentId}`);
  }
  res.status(StatusCodes.OK).json({removedResident});
};

module.exports = {
  getAllResidents,
  getResident,
  createResident,
  updateResident,
  deleteResident
}
