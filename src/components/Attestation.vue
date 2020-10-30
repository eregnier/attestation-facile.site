<template>
    <b-card>
        <p>Remplis le formulaire avec tes informations</p>
        <b-form-group label="Prénom">
            <b-input placeholder="ex: Jocelyne" v-model="form.firstname" />
        </b-form-group>
        <b-form-group label="Nom">
            <b-input placeholder="ex: Stiche" v-model="form.lastname" />
        </b-form-group>
        <b-form-group label="Date de naissance">
            <b-input placeholder="ex: 10/05/1975" v-model="form.birthDate" />
        </b-form-group>
        <b-form-group label="Lieu de naissance">
            <b-input placeholder="ex: Lille" v-model="form.birthPlace" />
        </b-form-group>
        <b-form-group label="Adresse">
            <b-input placeholder="ex: 12 rue des fourmis" v-model="form.adress" />
        </b-form-group>
        <b-form-group label="Ville">
            <b-input placeholder="ex: Rennes" v-model="form.city" />
        </b-form-group>
        <b-form-group label="Code Postal">
            <b-input placeholder="ex: 35700" v-model="form.postalCode" />
        </b-form-group>
         <b-form-group label="Ville de sortie">
            <b-input placeholder="ex: Lens" v-model="form.targetTown" />
        </b-form-group>
        <b-form-group label="Date de sortie">
            <b-input-group>
                <b-input
                    placeholder="ex: 30/10/2020"
                    v-model="form.attestationDate"
                />
                <b-input-group-append>
                    <b-button variant="outline-secondary" @click="setToday"
                        >Aujourd'hui</b-button
                    >
                </b-input-group-append>
            </b-input-group>
        </b-form-group>
        <b-form-group label="Heure de sortie">
            <b-input-group>
                <b-input
                    placeholder="ex: 10h12 am"
                    v-model="form.attestationTime"
                />
                <b-input-group-append>
                    <b-button variant="outline-secondary" @click="setNow"
                        >Maintenant</b-button
                    >
                </b-input-group-append>
            </b-input-group>
        </b-form-group>
        <hr />
        <p class="text-center">Motif</p>
        <b-list-group>
            <b-list-group-item
                class="pointer"
                :active="selectedReason.value === reason.value"
                v-for="(reason, x) in reasons"
                :key="x"
                @click="selectReason(reason)"
                >{{ reason.label }}</b-list-group-item
            >
        </b-list-group>
        <br />
        <b-check v-model="agree" @input="onAgree">
            J'ai connaissances des informations détaillées de ce formulaires
            disponibles
            <a href="https://media.interieur.gouv.fr/deplacement-covid-19">
                sur le formulaire officiel
            </a>
        </b-check>
        <br />
        <div class="text-center">
            <b-button :disabled="!agree" @click="generate" variant="primary">
                Générer attestation
            </b-button>
        </div>
    </b-card>
</template>
<script>
import pdf from "../utils/certificate";
export default {
    data() {
        return {
            form: {},
            agree: false,
            reasons: [
                { label: "Pro", value: "travail" },
                { label: "Achats", value: "achats" },
                { label: "Soins", value: "sante" },
                { label: "Assistance famille", value: "famille" },
                { label: "Assistance handicap", value: "handicap" },
                { label: "Promenade (max 1h, 1km)", value: "promenade" },
                {
                    label: "Convocation / RV service public",
                    value: "judiciaire",
                },
                { label: "Mission d'intérêt général", value: "missions" },
                { label: "Enfants", value: "ecole" },
            ],
            selectedReason: undefined,
            pdf: undefined,
        };
    },
    created() {
        this.form = JSON.parse(localStorage.getItem("form") || "{}");
        this.agree = !!parseInt(localStorage.getItem("agree") || 0);
        this.selectedReason = JSON.parse(
            localStorage.getItem("reason") || "{}"
        );
        console.log("selected reason", this.selectedReason);
        this.setNow()
        this.setToday()
    },
    watch: {
        form: {
            handler: (form) => {
                localStorage.setItem("form", JSON.stringify(form));
            },
            deep: true,
        },
    },
    methods: {
        selectReason(reason) {
            this.selectedReason = reason;
            localStorage.setItem("reason", JSON.stringify(reason));
        },
        setToday() {
            const d = new Date();
            this.form = {
                ...this.form,
                attestationDate: `${d
                    .getDate()
                    .toString()
                    .padStart(2, "0")}/${d
                    .getMonth()
                    .toString()
                    .padStart(2, "0")}/${d.getFullYear()}`,
            };
        },
        setNow() {
            const d = new Date();
            this.form = {
                ...this.form,
                attestationTime: `${d
                    .getHours()
                    .toString()
                    .padStart(2, "0")}h${d
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")} ${d.getHours() >= 12 ? "pm" : "am"}`,
            };
        },
        onAgree() {
            console.log("agree", this.agree);
            localStorage.setItem("agree", this.agree ? "1" : "0");
        },
        async generate() {
            const blob = await pdf(
                {
                    lastname: this.form.lastname,
                    firstname: this.form.firstname,
                    birthday: this.form.birthDate,
                    lieunaissance: this.form.birthPlace,
                    address: this.form.adress,
                    zipcode: this.form.postalCode,
                    town: this.form.city,
                    destinationtown: this.form.targetTown,
                    destinationcounty: "france",
                    datesortie: this.form.attestationDate,
                },
                this.selectedReason.value
            );
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `Attestation du ${this.form.attestationDate} ${this.form.attestationTime}.pdf`;
            document.body.appendChild(link);
            link.click();
        },
    },
};
</script>
<style scoped>
.pointer {
    cursor: pointer;
}
</style>