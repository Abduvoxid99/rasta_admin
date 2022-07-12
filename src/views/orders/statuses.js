import TagBtn from "../../components/Tag/TimeTag"

export const statuses = {
  NewStatusId: "986a0d09-7b4d-4ca9-8567-aa1c6d770505",
  FutureStatusId: "bf9cc968-367d-4391-93fa-f77eda2a7a99",
  OperatorAcceptedStatusId: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
  VendorAcceptedStatusId: "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
  VendorReadyStatusId: "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
  CourierAcceptedStatusId: "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0",
  CourierPickedUpStatusId: "84be5a2f-3a92-4469-8283-220ca34a0de4",
  DeliveredStatusId: "79413606-a56f-45ed-97c3-f3f18e645972",
  FinishedStatusId: "e665273d-5415-4243-a329-aee410e39465",
  OperatorCancelledStatusId: "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
  VendorCancelledStatusId: "c4227d1b-c317-46f8-b1e3-a48c2496206f",
  CourierCancelledStatusId: "6ba783a3-1c2e-479c-9626-25526b3d9d36",
  ServerCancelledStatusId: "d39cb255-6cf5-4602-896d-9c559d40cbbe",
}

const {
  NewStatusId,
  OperatorAcceptedStatusId,
  VendorReadyStatusId,
  VendorAcceptedStatusId,
  CourierAcceptedStatusId,
  CourierPickedUpStatusId,
  DeliveredStatusId,
  FinishedStatusId,
  OperatorCancelledStatusId,
  VendorCancelledStatusId,
  CourierCancelledStatusId,
  ServerCancelledStatusId,
  FutureStatusId,
} = statuses

export const statusCheck = (id, t, isTagBtn) => {
  switch (id) {
    case NewStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#0452C8" bgColor="#D7EDFF">
          <span>{t("new")}</span>
        </TagBtn>
      )
    case FutureStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#0452C8" bgColor="#D7EDFF">
          <span> {t("pre.order")}</span>
        </TagBtn>
      )

    case OperatorAcceptedStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#006d75" bgColor="#b5f5ec">
          <span> {t("operator.accepted")}</span>
        </TagBtn>
      )
    case VendorReadyStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#d48806" bgColor="#fff1b8">
          <span>{t("branch.prepared")}</span>
        </TagBtn>
      )
    case VendorAcceptedStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#ad8b00" bgColor="#fffb8f">
          <span>{t("branch.accepted")}</span>
        </TagBtn>
      )
    case CourierAcceptedStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#0452C8" bgColor="#D7EDFF">
          <span>{t("courier.accepted")}</span>
        </TagBtn>
      )
    case CourierPickedUpStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#003a8c" bgColor="#bae7ff">
          <span>{t("courier.onTheWay")}</span>
        </TagBtn>
      )
    case DeliveredStatusId:
      return (
        <TagBtn autoSize={isTagBtn} color="#237804" bgColor="#b7eb8f">
          <span>{t("delivered")}</span>
        </TagBtn>
      )
    case FinishedStatusId:
      return (
        <TagBtn
          autoSize={isTagBtn}
          color="#1AC19D"
          bgColor="rgba(56, 217, 185, 0.15)"
        >
          <span>{t("finished")}</span>
        </TagBtn>
      )
    case OperatorCancelledStatusId:
      return (
        <TagBtn
          autoSize={isTagBtn}
          color="#F76659"
          bgColor="rgba(247, 102, 89, 0.1)"
        >
          <span>{t("operator.declined")}</span>
        </TagBtn>
      )
    case VendorCancelledStatusId:
      return (
        <TagBtn
          autoSize={isTagBtn}
          color="#F76659"
          bgColor="rgba(247, 102, 89, 0.1)"
        >
          <span>{t("branch.declined")}</span>
        </TagBtn>
      )
    case CourierCancelledStatusId:
      return (
        <TagBtn
          autoSize={isTagBtn}
          color="#F76659"
          bgColor="rgba(247, 102, 89, 0.1)"
        >
          <span>{t("courier.declined")}</span>
        </TagBtn>
      )
    case ServerCancelledStatusId:
      return (
        <TagBtn
          autoSize={isTagBtn}
          color="#F76659"
          bgColor="rgba(247, 102, 89, 0.1)"
        >
          <span>{t("server.declined")}</span>
        </TagBtn>
      )
    default:
      return <></>
  }
}
