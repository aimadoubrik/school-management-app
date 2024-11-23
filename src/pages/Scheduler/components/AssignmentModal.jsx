import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowAddAssignmentModal,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../../features/scheduler/schedulerSlice";
import { Modal } from "../../../components";
import { Captions, Pause, Play, Plus, Save, Trash2, User, Users } from 'lucide-react';
import AssignmentField from "./AssignmentFields";

export default function AssignmentModal() {
  const dispatch = useDispatch();
  const showAddAssignmentModal = useSelector((state) => state.scheduler.showAddAssignmentModal);
  const hours = useSelector((state) => state.scheduler.hours);
  const selectedDay = useSelector((state) => state.scheduler.selectedDay);
  const selectedStartTime = useSelector((state) => state.scheduler.selectedStartTime);
  const selectedEndTime = useSelector((state) => state.scheduler.selectedEndTime);
  const assignments = useSelector((state) => state.scheduler.assignments);
  const selectedGroupe = useSelector((state) => state.scheduler.selectedGroupe);
  const selectedFormateur = useSelector((state) => state.scheduler.selectedFormateur);

  const timeSlots = hours.flatMap((hour) => hour.subHours);
  const existingAssignment = assignments.find(
    (assignment) =>
      assignment.day === selectedDay &&
      assignment.startTime === selectedStartTime &&
      assignment.endTime === selectedEndTime && 
      (assignment.groupe.codeGroupe === selectedGroupe || assignment.formateur.matricule === selectedFormateur)
  );

  const [assignmentData, setAssignmentData] = useState({
    title: "",
    formateur: {
      matricule: "",
      nom: "",
      email: "",
      secteur: ""
    },
    groupe: {
      codeGroupe: selectedGroupe || "",
      intituleGroupe: "",
      filiere: "",
      secteur: "",
    },
    salle: "",
    day: "",
    startTime: "",
    endTime: "",
    id: null,
  });

  const findGroupDetails = (codeGroupe) => {
    return (
      assignments.find(
        (assignment) => assignment.groupe.codeGroupe === codeGroupe
      )?.groupe || {}
    );
  };

  const findFormateurDetails = (matricule) => {
    return (
      assignments.find(
        (assignment) => assignment.formateur.matricule === matricule
      )?.formateur || {}
    );
  };
  

  const getFormateursForGroup = (group) => {
    return assignments
      .filter((assignment) => assignment.groupe.codeGroupe === group?.codeGroupe)
      .map((assignment) => assignment.formateur)
      .filter(
        (formateur, index, self) =>
          formateur &&
          index ===
            self.findIndex((f) => f?.matricule === formateur?.matricule)
      );
  };

  const getGroupsForFormateur = (formateur) => {
    return assignments
      .filter(
        (assignment) =>
          assignment.formateur?.matricule === formateur?.matricule
      )
      .map((assignment) => assignment.groupe)
      .filter(
        (groupe, index, self) =>
          groupe &&
          index === self.findIndex((g) => g?.codeGroupe === groupe?.codeGroupe)
      );
  };

  useEffect(() => {
    if (showAddAssignmentModal && selectedStartTime && selectedEndTime ) {
      if (existingAssignment) {
        setAssignmentData(existingAssignment);
      } else {
        // Update assignment data when a group or formateur is selected
        const groupDetails = selectedGroupe ? findGroupDetails(selectedGroupe) : {};
        const formateurDetails = selectedFormateur ? findFormateurDetails(selectedFormateur) : {};

        setAssignmentData((prevData) => ({
          ...prevData,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          groupe: { ...prevData.groupe, ...groupDetails },
          formateur: { ...prevData.formateur, ...formateurDetails },
          id: null,
        }));
      }
    }
  }, [
    showAddAssignmentModal,
    selectedStartTime,
    selectedEndTime,
    existingAssignment,
    selectedGroupe,
    selectedFormateur,
  ]);

  const handleClose = () => {
    dispatch(setShowAddAssignmentModal(false));
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, startTime, endTime, formateur } = assignmentData;
    if (!title || !startTime || !endTime || !formateur.matricule) {
      alert("Please fill in all required fields.");
      return;
    }

    const updatedAssignmentData = {
      ...assignmentData,
      day: selectedDay || assignmentData.day,
    };

    if (updatedAssignmentData.id) {
      dispatch(updateAssignment(updatedAssignmentData));
    } else {
      dispatch(
        addAssignment({
          ...updatedAssignmentData,
          id: Date.now().toString(),
        })
      );
    }
    handleClose();
  };

  const handleDelete = () => {
    if (assignmentData.id) {
      dispatch(deleteAssignment(assignmentData.id));
      handleClose();
    }
  };

  const resetForm = () => {
    setAssignmentData({
      title: "",
      formateur: {
        matricule: "",
        nom: "",
        email: "",
        secteur: ""
      },
      groupe: {
        codeGroupe: selectedGroupe || "",
        intituleGroupe: "",
        filiere: "",
        secteur: "",
      },
      salle: "",
      day: "",
      startTime: "",
      endTime: "",
      id: null,
    });
  };

  if (!showAddAssignmentModal) return null;

  const renderFields = () => {
    const fieldsConfig = selectedGroupe
      ? [
          {
            label: "Groupe",
            icon: Users,
            value: assignmentData.groupe.codeGroupe,
            isDisabled: true,
          },
          {
            label: "Formateur",
            icon: User,
            value: assignmentData.formateur?.matricule || "",
            options: getFormateursForGroup(assignmentData.groupe).map((formateur) => ({
              value: formateur.matricule,
              label: formateur.nom,
            })),
            onChange: (matricule) =>
              setAssignmentData({
                ...assignmentData,
                formateur: getFormateursForGroup(assignmentData.groupe).find(
                  (f) => f.matricule === matricule
                ),
              }),
          },
        ]
      : [
          {
            label: "Formateur",
            icon: User,
            value: assignmentData.formateur?.nom || "",
            isDisabled: true,
          },
          {
            label: "Groupe",
            icon: Users,
            value: assignmentData.groupe?.codeGroupe || "",
            options: getGroupsForFormateur(assignmentData.formateur).map((groupe) => ({
              value: groupe.codeGroupe,
              label: groupe.intituleGroupe,
            })),
            onChange: (codeGroupe) =>
              setAssignmentData({
                ...assignmentData,
                groupe: getGroupsForFormateur(assignmentData.formateur).find(
                  (g) => g.codeGroupe === codeGroupe
                ),
              }),
          },
        ];
  
    // Render fields dynamically
    return fieldsConfig.map((field, index) => (
      <AssignmentField
        key={index}
        label={field.label}
        icon={field.icon}
        value={field.value}
        options={field.options}
        onChange={field.onChange}
        isDisabled={field.isDisabled}
      />
    ));
  };

  return (
    <Modal isOpen={showAddAssignmentModal} onClose={handleClose} maxWidth="max-w-xl">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {assignmentData.id ? "Edit Assignment" : "Add Assignment"}
        </h2>
        <form
        onSubmit={handleSubmit}
        className="space-y-4"
        >
        <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Captions className="w-4 h-4" />
                Title
              </span>
            </label>
          <input
            type="text"
            name="title"
            placeholder="Assignment title"
            value={assignmentData.title}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, title: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Time
            </span>
          </label>
          <select
            value={assignmentData.startTime}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, startTime: e.target.value })
            }
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Start Time</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot.startTime}>
                {slot.startTime}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Pause className="w-4 h-4" />
              End Time
            </span>
          </label>
          <select
            value={assignmentData.endTime}
            onChange={(e) =>
              setAssignmentData({ ...assignmentData, endTime: e.target.value })
            }
            className="select select-bordered w-full"
            required
          >
            <option value="">Select End Time</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot.endTime}>
                {slot.endTime}
              </option>
            ))}
          </select>
        </div>
        {renderFields()}

        <div className="flex justify-end space-x-2">
          {assignmentData.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary gap-2"
          >
            {assignmentData.id ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {assignmentData.id ? "Update" : "Add"}
          </button>
        </div>
      </form>
      </div>
    </Modal>

  );
}
