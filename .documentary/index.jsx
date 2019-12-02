/**
 * The footer for documentation.
 */
export const footer = () => {
  const alt = '{{ org }}'
  const src = 'https://avatars3.githubusercontent.com/u/38815725?s=100'
  const copyright = `&trade; [{{ trademark }}][1] {{ year }}`
  return [
    (<table>
      <tr>
        <td>
          <img src={src} alt={alt} />
        </td>
        <td dangerouslySetInnerHTML={{ __html: copyright }}/>
      </tr>
    </table>),
    '[1]: {{ website }}'
  ]
}