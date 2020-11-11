<template>
  <div
    id="app"
    class="container-fluid"
  >
    <br />
    <b-row>
      <b-col
        sm="12"
        md="4"
        offset-md="4"
      >
        <b-tabs content-class="mt-3">
          <b-tab
            title="Attestation"
            active
          >
            <attestation />
          </b-tab>
          <b-tab title="Informations">
            <informations />
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import Attestation from "./components/Attestation";
  import Informations from "./components/Informations";
  export default {
    components: { Attestation, Informations },
    name: "App",
  };
</script>
