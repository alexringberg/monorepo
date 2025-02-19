import styled from "styled-components"

import { Modal } from "@Components/shared"
import { header2 } from "@Styles/typography"

/** Notify of any errors that happen. */
const SupportModal = ({ ...props }) => {
	return (
		<Modal backgroundClickToClose title="UH OH. WE MESSED UP">
			<Paragraph>This error has been logged into our systems and we will investigate it as soon as possible.</Paragraph>
		</Modal>
	)
}

export default SupportModal

// Styled Components

const Paragraph = styled.p`
	margin: 0 auto;
	margin-bottom: 32px;
	${header2};
`
