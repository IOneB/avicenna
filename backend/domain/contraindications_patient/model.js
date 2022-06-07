class ContraindicationsPatient {
  constructor(body = {}) {
    this.id_contraindications = body.id_contraindications;
    this.id_patient = body.id_patient;

    this.date_of_diagnosis = body.date_of_diagnosis;
    this.is_chronic = body.is_chronic;
    this.close_date = body.close_date;
  }
}

module.exports = ContraindicationsPatient;
