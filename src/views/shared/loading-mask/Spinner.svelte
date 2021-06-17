<script lang="ts">
    export let message: string;
</script>

<div class="container">
    <div class="row">
        <div class="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="loading"></div>
        </div>

        {#if message !== ''}
            <p class="spinner-message">{message}</p>
        {/if}
    </div>
</div>

<style lang="scss">
  @keyframes load {
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  .container {
    width: 6rem;
    height: 6rem;
  }

  .loader {
    width: 175px;
    height: 175px;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .dot {
      width: 87.5px;
      height: 100%;
      margin: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      &::before {
        border-radius: 100%;
        width: 87.5px;
        height: 87.5px;
        content: "";
        transform: scale(0);
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
      }

      &:nth-child(7n+1) {
        transform: rotate(45deg);

        &::before {
          animation: 0.8s linear 0.1s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+2) {
        transform: rotate(90deg);

        &::before {
          animation: 0.8s linear 0.2s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+3) {
        transform: rotate(135deg);

        &::before {
          animation: 0.8s linear 0.3s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+4) {
        transform: rotate(180deg);

        &::before {
          animation: 0.8s linear 0.4s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+5) {
        transform: rotate(225deg);

        &::before {
          animation: 0.8s linear 0.5s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+6) {
        transform: rotate(270deg);

        &::before {
          animation: 0.8s linear 0.6s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+7) {
        transform: rotate(315deg);

        &::before {
          animation: 0.8s linear 0.7s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }

      &:nth-child(7n+8) {
        transform: rotate(360deg);

        &::before {
          animation: 0.8s linear 0.8s normal none infinite running load;
          background: #333333 none repeat scroll 0 0;
        }
      }
    }

    .loading {
      width: 180px;
      height: 20px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      position: absolute;
      left: 0;
      bottom: -40px;
      right: 0;
    }
  }

  .spinner-message {
    text-align: center;
  }
</style>
