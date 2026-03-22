const Project = require('../models/Project');
const Client = require('../models/Client');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).populate('client', 'name company');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id }).populate('client');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create project
const createProject = async (req, res) => {
  const { title, description, status, startDate, deadline, budget, progress, clientId } = req.body;
  try {
    const client = await Client.findOne({ _id: clientId, user: req.user._id });
    if (!client) return res.status(400).json({ message: 'Invalid client' });

    const project = await Project.create({
      title,
      description,
      status,
      startDate,
      deadline,
      budget,
      progress: progress || 0,
      client: clientId,
      user: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, status, startDate, deadline, budget, progress, tasks } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (deadline !== undefined) project.deadline = deadline;
    if (budget !== undefined) project.budget = budget;
    if (progress !== undefined) project.progress = progress;
    if (tasks !== undefined) project.tasks = tasks;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };