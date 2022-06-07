const patientRepository = require("../domain/patient/repository");
const contraindicationsRepository = require("../domain/contraindications_patient/repository");

module.exports = {
  validate(patient) {
    let errors = [];

    if (!patient.name) errors.push("Имя");
    if (!patient.snils) errors.push("СНИЛС");
    if (!patient.date_of_birth) errors.push("Дата рождения");
    if (!patient.sex) errors.push("Пол");

    if (errors.length) {
      throw new Error(
        `Не удалось сохранить форму. Не заполнены следующие поля: ${errors.join(
          ", "
        )}`
      );
    }
  },
  async get() {
    const patients = await patientRepository.get();

    return patients;
  },
  async getById(id) {
    const patient = await patientRepository.getById(id);

    const contraindications = await contraindicationsRepository.getByPatient(
      id
    );

    patient.allergies = [];
    patient.diseases = [];
    patient.specialInstructions = [];

    contraindications.forEach((c) => {
      const dto = {
        id: c.id_contraindications,
        is_chronic: c.is_chronic ?? false,
        close_date: c.close_date,
        date_of_diagnosis: c.date_of_diagnosis,
      };

      if (c.type === 0) {
        patient.allergies.push(dto);
      } else if (c.type === 1) {
        patient.diseases.push(dto);
      } else if (c.type === 2) {
        patient.specialInstructions.push(dto);
      }
    });

    return patient;
  },
  async create(patient) {
    this.validate(patient);

    if (patient.id) {
      await patientRepository.update(patient, patient.id);
    } else {
      await patientRepository.create(patient);
    }

    await contraindicationsRepository.delete({
      id_patient: patient.id,
    });

    await Promise.all([
      this.__createContraindications(patient, patient.allergies),
      this.__createContraindications(patient, patient.diseases),
      this.__createContraindications(patient, patient.specialInstructions),
    ]);
  },
  delete(id) {
    return patientRepository.delete(id);
  },
  __createContraindications(patient, contraindications) {
    return Promise.all(
      contraindications?.map((contraindication) =>
        contraindicationsRepository.create({
          id_patient: patient.id,
          id_contraindications: contraindication.id,
          date_of_diagnosis: contraindication.date_of_diagnosis || null,
          close_date: contraindication.close_date || null,
          is_chronic: contraindication.is_chronic ?? false,
        })
      )
    );
  },
};
