import styled from "styled-components"

import colors from "@Colors"
import { Button, Modal, SVG } from "@Components/shared"
import { header2, paragraph } from "@Styles/typography"
import { useDispatch } from "@Redux/store"
import { setModal } from "@Redux/slices/dashboard"
import { usePremiumStatus, useChannelData } from "@Redux/slices/dashboard/selectors"
import { getToken } from "@Services/firebase/auth/getToken"

const CENTER_SVG = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: 'translate("-50%, -50%")'
}

const CheckMark = () => (
	<td>
		<SVG.CheckMark width="20px" stroke={colors.lighter} style={CENTER_SVG} />
	</td>
)
const X = () => (
	<td>
		<SVG.X width="20px" fill={colors.darkRed} style={CENTER_SVG} />
	</td>
)

const PremiumPlans = ({ ...props }) => {
	const dispatch = useDispatch()
	const { _id, displayName, urlSafeName } = useChannelData()
	const { isPremium } = usePremiumStatus()

	const handleUpgrade = async () => {
		const apiRoute = isPremium ? `/api/payments/managePremium` : `/api/payments/buyPremium`

		const result = await fetch(apiRoute, {
			method: "POST",
			headers: {
				authorization: `Bearer ${await getToken()}`
			},
			body: JSON.stringify({ _id, displayName, urlSafeName })
		})

		const checkoutSession = await result.json()

		window.open(checkoutSession.url, "_blank")
	}

	return (
		<Modal title="COMPARE PLANS" style={{ position: "relative" }}>
			<Paragraph>Choose the plan that's right for you.</Paragraph>
			<Table>
				<colgroup style={{ zIndex: 2 }}>
					<col style={{ minWidth: "250px" }} />
					<col style={{ width: "100%", minWidth: "250px", maxWidth: "500px" }} />
					<col style={{ width: "100%", minWidth: "250px", maxWidth: "500px" }} />
				</colgroup>
				<thead>
					<tr>
						<Th></Th>
						<Th>
							BASIC
							<HeaderSubline>FREE</HeaderSubline>
						</Th>
						<Th>
							<SVG.Premium style={{ width: "24px" }} /> PREMIUM
							<HeaderSubline>EARLY BIRD - $5/MO</HeaderSubline>
						</Th>
					</tr>
				</thead>
				<TBody>
					<TableRow>
						<RowHeader>Create, edit, & feature kits</RowHeader>
						<CheckMark />
						<CheckMark />
					</TableRow>
					<TableRow>
						<RowHeader>Add account managers</RowHeader>
						<CheckMark />
						<CheckMark />
					</TableRow>
					<TableRow>
						<RowHeader>Embed social media content</RowHeader>
						<CheckMark />
						<CheckMark />
					</TableRow>
					<TableRow>
						<RowHeader>Access channel overlays</RowHeader>
						<X />
						<CheckMark />
					</TableRow>
					<TableRow>
						<RowHeader>AutoBot (COMING SOON)</RowHeader>
						<X />
						<CheckMark />
					</TableRow>
					<TableRow>
						<RowHeader>Channel profile customization</RowHeader>
						<X />
						<CheckMark />
					</TableRow>
				</TBody>
			</Table>
			<ButtonsContainer>
				<Button
					type="button"
					design="transparent"
					text="CLOSE"
					onClick={() => dispatch(setModal({ type: "", data: "" }))}
				/>
				<Button type="button" design="premium" text={isPremium ? "MANAGE" : "UPGRADE"} onClick={handleUpgrade} />
			</ButtonsContainer>
		</Modal>
	)
}

export default PremiumPlans

const Paragraph = styled.p`
	${paragraph};
	margin-bottom: 24px;
	color: ${colors.white};
`

const Table = styled.table`
	width: 100%;
	margin-bottom: 88px;
	letter-spacing: 2px;
	z-index: 2;
`

const Th = styled.th`
	${header2};
	padding-top: 64px;

	&:last-of-type {
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		background: ${colors.premium};
	}
`

const TableRow = styled.tr`
	& > td:last-of-type {
		background: ${colors.premium};
	}

	&:last-of-type {
		& > td:last-of-type {
			border-bottom-left-radius: 12px;
			border-bottom-right-radius: 12px;
		}
	}
`

const TBody = styled.tbody`
	td {
		position: relative;
		padding: 40px;
	}
`

const HeaderSubline = styled.span`
	display: block;
	${paragraph};
	margin-top: 10px;
	color: ${colors.lighter};
	font-weight: 400;
	font-size: 14px;
`

const RowHeader = styled.td`
	${paragraph};
	padding: 20px 0;
	color: ${colors.lighter};
	font-size: 16px;
`

const ButtonsContainer = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	padding: 24px;
	background: ${colors.middle};
`
