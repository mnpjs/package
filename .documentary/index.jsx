/**
 * The footer for documentation.
 */
export const footer = () => {
  return [
    (<table>
      <tr>
        <td>
          <img src="https://avatars3.githubusercontent.com/u/38815725?s=100" alt="{{ org }}" />
        </td>
        <td>
          {`&trade; [{{ trademark }}][1] {{ year }}`}
        </td>
      </tr>
    </table>),
    '[1]: {{ website }}'
  ]
}