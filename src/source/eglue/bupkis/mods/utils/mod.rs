
//https://www.reddit.com/r/rust/comments/gt62x5/comment/fsahfgv
pub fn iterationforeach<I: IntoIterator<Item = T>, T>(iter: I) -> Result<usize, T::Error>
where
    T: TryInto<u8>,
{
    let mut iter = iter.into_iter();

    let mut err = None;
    let count = count_twos(iter::from_fn(|| match iter.next().map(TryInto::try_into) {
        Some(Ok(v)) => Some(v),
        Some(Err(e)) => {
            err = Some(e);
            None
        }
        None => None,
    }));

    if let Some(err) = err {
        Err(err)
    } else {
        Ok(count)
    }
}//.copied()
